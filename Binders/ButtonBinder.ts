// ButtonBinder works with buttons that have a buttonclick attribute.
module Fenix.Binders {

    export class ButtonBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "buttonclick";
        }


        public OnInitialize() {
            // If the element is clicked, execute an action in the execution context.
            this.Element.click((e) => {
                var methodName = this.GetValueByKey("METHOD");
                var arg = this.GetValueByKey("ARG");

                // The UI should already have disabled buttons/links etc, but as links still seem to be clickable, we check things here too.
                var a = "can" + methodName;
                var fn = this.ExecutionContext[a];
                var canDo = true;
                if (fn && typeof fn === "function") {
                    var canDoMethod = $.proxy(fn, this.ExecutionContext);
                    canDo = canDoMethod();
                }

                if (canDo) {
                    var argument = null;
                    if (arg) {
                        if (arg.toUpperCase() == "DATACONTEXT")
                            argument = this.DataContext;
                        else
                            argument = this.DataContext[arg];
                    }
                    this.ExecuteMethod(methodName, argument);
                }
            });
        }


        public OnDataContextChange(property: string, value: any) {
            if (!this.Element)
                return;

            this.Element.removeAttr("disabled");

            var methodName = this.GetValueByKey("PROPERTY");
            var can = "can" + methodName;
            var fn = this.DataContext[can];
            if (typeof fn === "function") {

                var canDoMethod = $.proxy(fn, this.ExecutionContext);
                var canDoValue = canDoMethod();
                if (!canDoValue)
                    this.Element.attr("disabled", "disabled");
            }
        }

    }
}