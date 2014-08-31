module Fenix.Types {

    // Binds elements to a datacontext and execution context.
    export class BindingContext {

        private binders: IBinder[] = [];


        // Bind any element that specifies a binding to the viewmodel recursively.
        public Bind(element: JQuery, dataContext: any, executionContext: any) {
            this.SetBinders(element, dataContext, executionContext);
        }


        public Unbind() {
            this.binders.forEach((item: IBinder, index, array) => {
                item.Unbind();
            });
            // Reset the binders collection.
            this.binders = [];
        }


        private SetBinders(element: JQuery, dataContext: any, executionContext: any) {

            var self = this;

            element.children().each(function () {
                var $child = jQuery(this);

                // Parse from bottom to top.
                self.SetBinders($child, dataContext, executionContext);

                var bindings = Fenix.Framework.BindingAttributes;

                // check if the element has attributes we can bind automatically, like text, visibility, hrefclick etc.
                for (var key in bindings) {
                    var attribute = $child.attr(key);
                    if (attribute) {
                        var binder = <IBinder> new window["Fenix"]["Binders"][bindings[key]]();
                        if (binder) {
                            binder.Bind($child, dataContext, executionContext, key);
                            self.binders.push(binder); 
                        }
                    }
                }

                // check for special types of bindings, handled by specific binders.
                var binding = $child.attr("binding");
                if (binding) {

                    // Instantiate a specific binder class and let it handle the binding by providing the element and the viewmodel.
                    var parser = new Fenix.Types.BindingParser(binding);
                    var binderName = parser.GetValueByKey("binder");
                    if (binderName) {
                        var binder = <IBinder> new window["Fenix"]["Binders"][binderName]();
                        if (binder) {
                            binder.Bind($child, dataContext, executionContext, "binding");
                            self.binders.push(binder);
                        }
                    }
                }
            });
        }
    } 
}