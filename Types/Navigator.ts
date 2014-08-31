module Fenix.Types {

    export class Navigator {

        public static Root: IViewModel;

        private static history: string[] = [];

        // Receives a request to navigate to a certain viewmodel given by a path.
        // NOTE: probably cash these request so we can cancel them if needed (perhaps 
        // when we receive another request while the first one is stil executing).

        public static Goto(hash: string, walkRoute: boolean = true) {

            // Set the hash if needed, which will trigger a hashchanged event which will call the Goto method again.
            if (location.hash != hash) {
                location.hash = hash;
                return;
            }

            // The hash is a route to a viewmodel. If not, quit now.
            if (!hash || hash == "#")
                return;

            // If the hash is the same as the last one stored in the history, return.
            if (this.history[this.history.length - 1] == hash)
                return;

            // Store in history.
            this.history.push(hash);

            // Start preparing the route.
            var viewmodel = this.Root;
            this.PrepareRoute(viewmodel, hash.substring(1), 0, walkRoute);
        }


        // Finds the most recent hash starting with the provided text and navigates to it.
        public static GotoLast(searchElement: string, walkRoute: boolean = true) {

            for (var index = this.history.length - 2; index >= 0; index--) {
                if (Utilities.StartsWith(this.history[index], searchElement))
                    break;
            }

            if (index >= 0)
                this.Goto(this.history[index], walkRoute);
        }


        // Given a route, prepares the route by instantiating all viewmodels requested by the route.
        // Note: instantiated viewmodels get bound to HTML elements automatically.
        // This also goes for any child viewmodel instantiated in their OnViewLoaded method.
        private static PrepareRoute(viewmodel: IViewModel, hash: string, index: number, walkRoute: boolean) {

            var elements = hash.split("/");

            if (index >= elements.length) {
                if (walkRoute)
                    this.WalkRoute(hash);

                viewmodel.OnActivated();
                return;
            }
            
            var element = elements[index];

            var parts = element.split("?");

            var viewModelName = parts[0];
            var child = <IViewModel>viewmodel[viewModelName];
            
            if (child) {
                this.PrepareRoute(child, hash, index + 1, walkRoute);
            }
            else {

                // Extract parameters from the hash, if any.
                var parameters = null;
                if (parts.length > 1)
                    parameters = this.ExtractParameters(parts[1]);

                // Create viewmodel.
                child = Utilities.CreateViewModel(viewModelName + "ViewModel", parameters);

                // Quit if creation failed (probably due to a bad url).
                if (!child)
                    throw "The URL is invalid.";

                // When the binding is done, continue.
                $(child).on("loaded.routepreparation", () => {
                    $(child).off("loaded.routepreparation");
                    this.PrepareRoute(child, hash, index + 1, walkRoute);
                });

                // Set the property of the parent viewmodel. This will show & bind the viewmodel on screen.
                // If the parent is a PlaceholderViewmodel, set its Item property. Otherwise set the
                // property with the same name as the viewmodel part of the hash.
                if (viewmodel instanceof Fenix.Base.PlaceholderViewModelBase) {
                    var placeholder = <Fenix.Base.PlaceholderViewModelBase>viewmodel;
                    placeholder.Item = child;
                }
                else {
                    viewmodel[viewModelName] = child; 
                }
            }
        }


        private static ExtractParameters(hash: string): any {
            var result = {};

            var parameters = hash.split("&");
            parameters.forEach((parameter) => {
                var keyValue = parameter.split("=");
                result[keyValue[0]] = keyValue[1]
            });

            return result;
        }


        private static WalkRoute(hash: string) {
            var routeName = null;

            // Exclude parameters in the hash.
            var paramIndex = hash.indexOf("?");
            if (paramIndex != -1)
                routeName = hash.substr(0, paramIndex).replace('/', '').trim() + "Route";
            else
                routeName = hash.replace('/', '').trim() + "Route";

            if (!window["Fenix"]["Routes"][routeName])
                console.log("No route for " + hash);
            else {
                var route = new window["Fenix"]["Routes"][routeName]();
                route.Walk();
            }
        }
    }
}
