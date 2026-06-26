import { ApiError } from "../utils/ApiError.js";

/**
 * Usine a middlewares d'autorisation.
 * Verifie si l'utilisateur connecte a les droits d'effectuer
 * une action sur une ressource, selon les regles definies dans policies.js.
 *
 * Utilisation sur les routes :
 *   router.get("/", authenticate, authorize("read", "Utilisateur"), controller.getAll);
 *   router.post("/", authenticate, authorize("create", "Intervention"), controller.create);
 *
 * @param {string} action - L'action voulue : "create" | "read" | "update" | "delete"
 * @param {string} ressource - Le modele concerne : "Utilisateur" | "Technicien" | "Site" | "Intervention"
 * @returns {Function} Middleware Express
 */
/** Autorise l upload de photo profil pour soi-meme ou pour un admin. */
export function authorizeUserPhoto(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentification requise");
    }
    const id = parseInt(req.params.id, 10);
    if (req.user.role === "ADMIN" || id === req.user.id) {
      next();
      return;
    }
    throw new ApiError(403, "Acces interdit : vous ne pouvez modifier que votre propre photo");
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(403, "Autorisation echouee"));
  }
}

export function authorize(action, ressource) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentification requise");
      }

      const aDroit = policies[req.user.role]?.can(action, ressource);

      if (!aDroit) {
        throw new ApiError(
          403,
          `Acces interdit : votre role (${req.user.role}) n'a pas le droit de ${action} ${ressource}`
        );
      }

      next();
    } catch (err) {
      if (err instanceof ApiError) return next(err);
      next(new ApiError(403, "Autorisation echouee"));
    }
  };
}

// ===========================================================================
// POLITIQUES D'ACCES CENTRALISEES
// ===========================================================================
// Modifiez ce dictionnaire pour definir les droits de chaque role.
//
// Structure : Role => { can(action, ressource) => boolean }
//
// Pour un controle plus fin (ex: un utilisateur ne voit que ses donnees),
// utilisez le filtre via la fonction filterOutput (cf. plus bas).
// ===========================================================================

const policies = {
  // ADMIN : acces total a tout
  ADMIN: {
    can(action, resource) {
      return true;
    },
    description: "Acces total a toutes les ressources",
  },

  // GESTIONNAIRE_PLANNING : interventions, techniciens, sites et presences
  GESTIONNAIRE_PLANNING: {
    can(action, resource) {
      const ressourcesAutorisees = ["Intervention", "Technicien", "Site", "Presence"];
      return ressourcesAutorisees.includes(resource);
    },
    description: "Gere les interventions, techniciens, sites et feuilles de presence",
  },

  // GESTIONNAIRE_EPI : lit/modifie les donnees EPI
  GESTIONNAIRE_EPI: {
    can(action, resource) {
      const ressourcesAutorisees = [
        "Equipements",
        "VerificationEPI",
        "VerificationEPI_Equipement",
      ];
      return ressourcesAutorisees.includes(resource);
    },
    description: "Gere les equipements de protection individuels",
  },

  // PMO : gestion des chantiers, bons de commande et facturation
  PMO: {
    can(action, resource) {
      const ressourcesAutorisees = [
        "Chantier",
        "BonDeCommande",
        "EtapeChantier",
        "LigneFacturation",
      ];
      return ressourcesAutorisees.includes(resource);
    },
    description: "Gere les chantiers, bons de commande et suivi financier",
  },

  // UTILISATEUR : acces minimal, lecture seule de son propre profil
  UTILISATEUR: {
    can(action, resource) {
      if (action === "read" && resource === "Utilisateur") return true;
      return false;
    },
    description: "Acces minimal : lecture de son propre profil",
  },
};

// ===========================================================================
// FILTRES DE DONNEES PAR ROLE
// ===========================================================================
// Certains roles ne doivent voir qu'une partie des donnees.
// Exemple : un UTILISATEUR ne voit que son propre profil.
//
// Utilisation dans un service :
//   import { filterOutput } from "../middlewares/authorize.js";
//   return filterOutput(req.user, data, "Utilisateur");
// ===========================================================================

/**
 * Filtre les donnees renvoyees selon le role de l'utilisateur.
 *
 * @param {Object} user - req.user (issu du token JWT)
 * @param {Object|Array} data - Donnees a filtrer
 * @param {string} resource - Nom du modele
 * @returns {Object|Array|null} Donnees filtrees
 */
export function filterOutput(user, data, resource) {
  // ADMIN voit tout
  if (user.role === "ADMIN") return data;

  // UTILISATEUR ne voit que ses propres donnees
  if (user.role === "UTILISATEUR") {
    if (Array.isArray(data)) {
      return data.filter((item) => item.id === user.id);
    }
    return data?.id === user.id ? data : null;
  }

  // GESTIONNAIRE_PLANNING voit tout sur ses ressources autorisees
  if (user.role === "GESTIONNAIRE_PLANNING") {
    return data;
  }

  // PMO voit tout sur ses ressources autorisees
  if (user.role === "PMO") {
    return data;
  }

  // GESTIONNAIRE_EPI voit tout sur ses ressources autorisees
  if (user.role === "GESTIONNAIRE_EPI") {
    return data;
  }

  return data;
}

export { policies };
