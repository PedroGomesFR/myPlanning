import { useState } from 'react';
import '../css/QuickGuide.css';

function QuickGuide({ isProfessional }) {
    const [showGuide, setShowGuide] = useState(false);

    const professionalSteps = [
        {
            title: "Complétez votre profil",
            description: "Ajoutez vos informations, photo, et description de votre salon"
        },
        {
            title: "Ajoutez vos prestations",
            description: "Créez vos services avec prix et durée dans l'onglet Prestations"
        },
        {
            title: "Ajoutez des photos",
            description: "Mettez en valeur votre salon avec de belles photos"
        },
        {
            title: "Gérez vos réservations",
            description: "Confirmez ou annulez les rendez-vous de vos clients"
        },
        {
            title: "Consultez vos statistiques",
            description: "Suivez vos performances dans la page Réservations"
        }
    ];

    const clientSteps = [
        {
            title: "Recherchez un professionnel",
            description: "Utilisez la page Recherche pour trouver votre salon"
        },
        {
            title: "Consultez les prestations",
            description: "Découvrez les services et tarifs proposés"
        },
        {
            title: "Réservez en ligne",
            description: "Choisissez votre prestation, date et heure"
        },
        {
            title: "Gérez vos rendez-vous",
            description: "Consultez et annulez vos réservations si besoin"
        }
    ];

    const steps = isProfessional ? professionalSteps : clientSteps;

    return (
        <div className="quick-guide">
            <button 
                className="help-button"
                onClick={() => setShowGuide(!showGuide)}
                title="Guide d'utilisation"
            >
                💡
            </button>

            {showGuide && (
                <div className="guide-popup">
                    <div className="guide-header">
                        <h3>🚀 Guide rapide</h3>
                        <button className="guide-close" onClick={() => setShowGuide(false)}>
                            ✕
                        </button>
                    </div>
                    <div className="guide-steps">
                        {steps.map((step, index) => (
                            <div key={index} className="guide-step">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                    <h4>{step.title}</h4>
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuickGuide;
