export interface NavMenu {
    moduleName: string;           // Nombre del modulo  
    moduleIcon?: string;          // Icono del modulo
    moduleLabel?: string;         // Label a mostrar con hover
    moduleChildren?: NavMenu[];     // Submodulos creados por el usuario, opcional
    modulePath?: string;          // Ruta a renderizar 
    moduleIsxpanded?: boolean;   // Huardar estado de lista desplegable aplica para item con children  
}





// export interface UserParams {
//     moduleName: string;
//     moduleIcon?: string;
//     moduleDescription?: string;
//     moduleRoute?: string;
//     isExpanded: boolean;
//     submodules?: SubmoduleResponse[];
// }
  
// export interface SubmoduleResponse {
//     submoduleName: string;
//     submoduleIcon?: string;
//     submoduleDescription?: string;
//     submoduleRoute?: string;
//     submoduleItems?: string[];
// }

