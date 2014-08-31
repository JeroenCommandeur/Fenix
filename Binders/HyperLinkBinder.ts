// HyperLinkBinder assumes its working with an a tag.
module Fenix.Binders {

    export class HyperLinkBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "hrefclick";
        }


        public OnInitialize() {
            // If the element is clicked, execute an action in the viewmodel.
            this.Element.click((e) => {
                var methodName = this.GetValueByKey("PROPERTY");

                this.ExecuteMethod(methodName, null);
            });
        }
    }
}