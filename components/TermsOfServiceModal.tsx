import React from 'react';
import { Button } from './Button';

interface TermsOfServiceModalProps {
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 no-print"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-of-service-title"
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <h2 id="terms-of-service-title" className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">Términos de Servicio</h2>
        <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 space-y-3 text-sm text-slate-700">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>Bienvenido/a a BoatTrip Planner (la "Aplicación"). Estos Términos de Servicio ("Términos") rigen tu acceso y uso de la Aplicación. Por favor, lee estos Términos cuidadosamente.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">1. Aceptación de los Términos</h3>
          <p>Al acceder o utilizar nuestra Aplicación, aceptas estar sujeto a estos Términos y a nuestra Política de Privacidad. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder a la Aplicación.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">2. Uso de la Aplicación</h3>
          <p>La Aplicación te permite ingresar preferencias para generar recomendaciones de viajes en barco. Estas recomendaciones son generadas por una inteligencia artificial (Google Gemini) y se proporcionan "tal cual", con fines informativos y de planificación.</p>
          <ul className="list-disc list-inside pl-4">
            <li>Eres responsable de la exactitud de la información que proporcionas.</li>
            <li>El uso de la Aplicación es bajo tu propio riesgo. Las recomendaciones, incluyendo información sobre rutas, meteorología, o estado del mar, son sugerencias y deben ser verificadas con fuentes oficiales y tu propio juicio antes de tomar cualquier decisión de navegación.</li>
            <li>No debes usar la Aplicación para ningún propósito ilegal o no autorizado.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">3. Contenido Generado por IA</h3>
          <p>Las recomendaciones y respuestas de chat son generadas por un modelo de lenguaje de IA. Si bien nos esforzamos por la precisión, no podemos garantizar que el contenido generado sea siempre completo, exacto o actual. Es tu responsabilidad evaluar críticamente la información proporcionada.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">4. Servicios de Terceros</h3>
          <p>La Aplicación utiliza varias API de terceros para su funcionamiento:</p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Google Gemini:</strong> Para la generación de recomendaciones y chat.</li>
            <li><strong>AccuWeather:</strong> Para datos meteorológicos en destinos en España.</li>
            <li><strong>Google AdSense:</strong> Para mostrar publicidad (con tu consentimiento).</li>
          </ul>
          <p>Tu uso de estos servicios a través de nuestra Aplicación también está sujeto a los términos y políticas de privacidad de dichos terceros. No somos responsables de las prácticas de estos terceros.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">5. Propiedad Intelectual y Restricciones de Uso</h3>
          <p>La Aplicación, incluyendo pero no limitándose a su diseño, interfaz de usuario, texto (excluyendo el contenido generado específicamente para ti por la IA como parte de una recomendación), gráficos, iconos, imágenes, clips de audio y video, software subyacente, código fuente, algoritmos, bases de datos (como la lista de puertos si es de compilación propia) y la compilación, coordinación, selección y disposición de dicho contenido (colectivamente, el "Contenido de la Aplicación"), son y seguirán siendo propiedad exclusiva de los desarrolladores de BoatTrip Planner y sus licenciantes, protegidos por derechos de autor, marcas registradas y otras leyes de propiedad intelectual.</p>
          <p>No se te concede ninguna licencia o derecho sobre el Contenido de la Aplicación más allá del uso personal y no comercial de la Aplicación según lo permitido por estos Términos.</p>
          <p>Estás estrictamente prohibido de:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Copiar, reproducir, modificar, distribuir, transmitir, mostrar, ejecutar, publicar, licenciar, crear trabajos derivados, transferir, vender o explotar comercialmente de cualquier otra manera cualquier parte de la Aplicación, su software o el Contenido de la Aplicación, excepto las recomendaciones generadas para tu uso personal.</li>
            <li>Realizar ingeniería inversa, descompilar, desensamblar, traducir o intentar de cualquier otra manera descubrir el código fuente, los algoritmos o los secretos comerciales subyacentes de la Aplicación.</li>
            <li>Utilizar cualquier sistema automatizado, incluyendo "robots", "spiders", "scrapers" o "offline readers", para acceder, monitorear, extraer o copiar cualquier parte de la Aplicación o su contenido, con el fin de crear directa o indirectamente una colección, compilación, base de datos o directorio, o para crear un producto o servicio derivado o competidor.</li>
            <li>Eliminar, ocultar, alterar o modificar cualquier aviso de derechos de autor, marca registrada u otros avisos de derechos de propiedad contenidos en o accedidos en conexión con la Aplicación.</li>
            <li>Utilizar la Aplicación o su contenido para cualquier propósito comercial no autorizado expresamente por escrito por los desarrolladores de BoatTrip Planner.</li>
          </ul>
          <p>El contenido generado por la IA para tu uso personal está sujeto a los términos de uso de Google Gemini. Todos los derechos no otorgados expresamente en estos Términos están reservados por los desarrolladores de BoatTrip Planner.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">6. Enlaces a Sitios de Terceros</h3>
          <p>Nuestra Aplicación puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por nosotros (por ejemplo, SamBoat para alquiler de barcos, Amazon para productos). No tenemos control ni asumimos responsabilidad por el contenido, las políticas de privacidad o las prácticas de los sitios o servicios de terceros.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">7. Limitación de Responsabilidad</h3>
          <p>En la máxima medida permitida por la ley aplicable, en ningún caso BoatTrip Planner, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, entre otros, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de (i) tu acceso o uso o incapacidad para acceder o usar la Aplicación; (ii) cualquier conducta o contenido de cualquier tercero en la Aplicación; (iii) cualquier contenido obtenido de la Aplicación; y (iv) el acceso no autorizado, uso o alteración de tus transmisiones o contenido, ya sea basado en garantía, contrato, agravio (incluida la negligencia) o cualquier otra teoría legal, hayamos sido informados o no de la posibilidad de tales daños.</p>
          <p>Específicamente, no somos responsables de ninguna decisión que tomes basada en las recomendaciones o información proporcionada por la Aplicación. La navegación segura y la toma de decisiones son tu responsabilidad.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">8. Exclusión de Garantías</h3>
          <p>Tu uso de la Aplicación es bajo tu único riesgo. La Aplicación se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". La Aplicación se proporciona sin garantías de ningún tipo, ya sean expresas o implícitas, incluidas, entre otras, las garantías implícitas de comerciabilidad, idoneidad para un propósito particular, no infracción o curso de ejecución.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">9. Cambios a los Términos</h3>
          <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30 días de anticipación antes de que entren en vigor los nuevos términos. Lo que constituye un cambio material se determinará a nuestra sola discreción. Al continuar accediendo o utilizando nuestra Aplicación después de que esas revisiones entren en vigor, aceptas estar sujeto a los términos revisados.</p>
          
          <h3 className="text-lg font-semibold text-slate-700 mt-3">10. Ley Aplicable</h3>
          <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflicto de leyes.</p>

          <h3 className="text-lg font-semibold text-slate-700 mt-3">11. Contacto</h3>
          <p>Si tienes alguna pregunta sobre estos Términos, por favor contáctanos en alemv.mlg@gmail.com.</p>
        </div>
        <div className="mt-6 text-right no-print">
          <Button onClick={onClose} variant="primary">Cerrar</Button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;