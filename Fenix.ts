module Fenix {

    export class Framework {

        public static ViewModels = {};
        public static BindingAttributes = {};

        private static namespaces: string[];
        private static callback: () => void;

        public static Initialize(namespaces: string[], callback: () => void) {

            this.namespaces = namespaces;
            this.callback = callback;

            // Preload our viewmodel html wrapper.
            Types.TemplateManager.Retrieve("Fenix.Templates.View", "Fenix/Templates/View.html", this, this.OnWrapperLoaded);
        }


        private static OnWrapperLoaded(self, html: string) {

            // Locate viewmodels in the namespace(s) provided.
            for (var key in self.namespaces) {
                var w = window[self.namespaces[key]];
                self.LocateViewModels(w, self.namespaces[key]);
            }

            // Locate binding attributes in the Fenix.Binders namespace.
            self.LocateBindingAttributes(window["Fenix"]["Binders"]);

            // Return by executing the callback.
            self.callback();
        }


        private static LocateViewModels(obj: any, parent: string) {

            for (var key in obj) {
                var namespace = parent + "." + key;

                if (typeof obj === "object")
                    this.LocateViewModels(obj[key], namespace);
            }

            if (parent.toLowerCase().substring(parent.length - 9, parent.length) == "viewmodel") {
                
                var viewModelName = parent.substr(parent.lastIndexOf(".")+1);
                var namespace = parent.substr(0, parent.lastIndexOf("."));
                this.ViewModels[viewModelName] = namespace;

                console.debug(viewModelName + ": " + namespace);
            }
        }

        
        private static LocateBindingAttributes(obj: any) {

            for (var key in obj) {
                if (Fenix.Types.Utilities.EndsWith(key, "Binder")) {

                    var attributeName = obj[key].AttributeName();
                    if (attributeName) {
                        this.BindingAttributes[attributeName] = key;

                        console.log(attributeName + ": " + key);
                    }
                }
            }
        }
    }
}