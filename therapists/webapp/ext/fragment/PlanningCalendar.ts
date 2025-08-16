import ExtensionAPI from 'sap/fe/core/ExtensionAPI';
import UI5Event from 'sap/ui/base/Event';
import MessageToast from 'sap/m/MessageToast';

/**
 * Generated event handler.
 *
 * @param this reference to the 'this' that the event handler is bound to.
 * @param event the event object provided by the event provider
 */

/**
 * Type01 - Anaranjado
 * Type02 - Rojo
 * Type03 - Rojo claro
 * Type04 - Rojo más claro
 * Type05 - Violeta
 * Type06 - Azul
 * Type07 - Verde claro
 * Type08 - Verde
 * Type09 - Gris
 * Type10 - Morado
*/

/**
 * Type02 --> Pending
 * Type01 --> OnHold
 * Type08 --> Confirmed
 */

export function status(this: ExtensionAPI, sStatus: string) {
    switch (sStatus) {
        case 'Pending': return 'Type02';
        case 'OnHold': return 'Type01';
        case 'Confirmed': return 'Type08';
    };
}