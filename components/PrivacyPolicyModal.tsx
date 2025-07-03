import React from 'react';
import { Button } from './Button';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 no-print"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <h2 id="privacy-policy-title" className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">Política de Privacidad</h2>
        <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 space-y-3 text-sm text-slate-700">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>Bienvenido/a a BoatTrip Planner (en adelante, "nosotros", "nuestro" o "la Aplicación"). Nos tomamos muy en serio tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando utilizas nuestra aplicación web.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">1. Información que Recopilamos</h3>
          <p>Podemos recopilar la siguiente información:</p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Información de Preferencias del Usuario:</strong> Cuando utilizas el formulario para generar recomendaciones, recopilamos los datos que proporcionas, como destino, número de personas, tipo de experiencia, presupuesto, actividades seleccionadas, nivel de experiencia náutica, fechas, y cualquier otro detalle que incluyas.</li>
            <li><strong>Interacciones con la IA:</strong> Si utilizas la función de chat para refinar tu recomendación, almacenamos temporalmente el historial de esa conversación durante tu sesión activa para mantener el contexto.</li>
            <li><strong>Datos de Uso y Almacenamiento Local:</strong> Utilizamos el almacenamiento local del navegador para guardar preferencias esenciales de la aplicación (por ejemplo, tu elección en el banner de consentimiento).</li>
            <li><strong>Información para Publicidad (con tu consentimiento):</strong> Si aceptas el uso de cookies para publicidad, Google AdSense y sus socios pueden recopilar información sobre tus visitas a esta y otras webs para mostrarte anuncios personalizados. Esto puede incluir identificadores de cookies, direcciones IP (truncadas o no), e información sobre tu navegador o dispositivo.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">2. Cómo Usamos Tu Información</h3>
          <p>Usamos la información recopilada para:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Proporcionar, operar y mantener nuestra Aplicación.</li>
            <li>Generar recomendaciones de viajes en barco personalizadas basadas en tus preferencias (Google Gemini).</li>
            <li>Permitir la interacción con nuestro asistente de IA (Google Gemini).</li>
            <li>Obtener datos meteorológicos (AccuWeather para España).</li>
            <li>Mostrar publicidad relevante a través de Google AdSense (con tu consentimiento).</li>
            <li>Mejorar y personalizar tu experiencia.</li>
            <li>Analizar el uso de la Aplicación (agregado y anónimo).</li>
            <li>Cumplir con obligaciones legales.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">3. Intercambio de Tu Información</h3>
          <p>No vendemos tu información personal. Podemos compartir tu información con:</p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Proveedores de API de IA (Google Gemini):</strong> Tus preferencias y chat se envían a Google Gemini.</li>
            <li><strong>Proveedores de API Meteorológica (AccuWeather):</strong> Para destinos en España.</li>
            <li><strong>Socios Publicitarios (Google AdSense):</strong> Si has consentido, compartimos información con Google y sus socios para mostrar anuncios. Google utiliza cookies para publicar anuncios basados en tus visitas anteriores a esta u otras páginas web. El uso de cookies de publicidad de Google permite a Google y a sus socios mostrar anuncios basados en tu visita a nuestros sitios y/o a otros sitios de Internet.</li>
            <li><strong>Obligaciones Legales.</strong></li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">4. Cookies y Almacenamiento Local</h3>
          <p>La Aplicación utiliza:</p>
            <ul className="list-disc list-inside pl-4">
                <li><strong>Almacenamiento Local (`localStorage`):</strong> Para recordar configuraciones esenciales, como tu estado de consentimiento de cookies.</li>
                <li><strong>Cookies de Publicidad (Google AdSense):</strong> Si das tu consentimiento, Google AdSense utilizará cookies para personalizar los anuncios que ves. Estas cookies pueden rastrear tu actividad en diferentes sitios web para mostrarte publicidad que sea relevante para tus intereses.</li>
            </ul>
          <p><strong>Gestión de Cookies y Publicidad Personalizada:</strong></p>
          <ul className="list-disc list-inside pl-4">
            <li>Puedes optar por no recibir publicidad personalizada de Google visitando la <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Configuración de anuncios de Google</a>.</li>
            <li>También puedes optar por que otros proveedores y redes publicitarias de terceros no usen cookies para la publicidad personalizada visitando <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">www.aboutads.info/choices/</a> (para usuarios en EE. UU.) o <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">www.youronlinechoices.com/</a> (para usuarios en Europa).</li>
            <li>Puedes gestionar el almacenamiento local y las cookies a través de la configuración de tu navegador. Deshabilitar ciertas cookies o el almacenamiento local puede afectar la funcionalidad de la Aplicación.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">5. Seguridad de Tu Información</h3>
          <p>Tomamos medidas razonables para proteger tu información. Sin embargo, ningún sistema es 100% seguro. Implementamos medidas técnicas y organizativas para salvaguardar la propiedad intelectual de la Aplicación. Las claves API para servicios de terceros se gestionan de forma segura.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">6. Retención de Datos</h3>
          <p>Las preferencias del usuario para generar una recomendación y el historial de chat se mantienen solo durante la sesión activa. Las preferencias de consentimiento guardadas en el almacenamiento local persisten hasta que las borres.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">7. Tus Derechos de Privacidad</h3>
          <p>Puedes gestionar tus preferencias de consentimiento de cookies a través del banner que se muestra. Para otros derechos, contáctanos.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">8. Privacidad de los Niños</h3>
          <p>Nuestra Aplicación no está dirigida a menores de 13 años (o la edad aplicable). No recopilamos información de niños a sabiendas.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">9. Cambios a Esta Política de Privacidad</h3>
          <p>Podemos actualizar esta Política. Te notificaremos publicando la nueva política aquí y actualizando la fecha.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">10. Contáctanos</h3>
          <p>Si tienes alguna pregunta, contáctanos en alemv.mlg@gmail.com.</p>
        </div>
        <div className="mt-6 text-right no-print">
          <Button onClick={onClose} variant="primary">Cerrar</Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;