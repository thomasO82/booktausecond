const { Prisma } = require('@prisma/client')
const bcrypt = require('bcrypt')

module.exports = Prisma.defineExtension({
    name: "userValidateExtension",
    query: {
        user: {
            create: async ({ args, query }) => {
                const errors = { }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.data.mail)) {
                    errors.mail = "Email invalide"
                }

                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(args.data.password)) {
                    errors.password = "Mot de passe invaluide (min 6 caractere, lettres et chiffres)"
                }

                if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(args.data.firstName)) {
                    errors.firstName = "Prenom invalide (pas de chiffre ni caractere speciaux)"
                }

                if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(args.data.firstName)) {
                    errors.lastName = "Nom invalide (pas de chiffre ni caractere speciaux)"
                }

                if (Object.keys(errors).length > 0) {
                    const error = new Error("Erreur de validation")
                    error.details = errors
                    throw error;  
                }
                return query(args)
                

            }
        }
    }
})