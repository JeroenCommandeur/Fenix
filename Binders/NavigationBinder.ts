// NavigationBinder assumes its working with an a tag. It creates a href value based on properties in the datacontext.
module Fenix.Binders {

    export class NavigationBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "navigation";
        }


        public OnInitialize() {
            this.ConstructHref();
        }


        // The navigation binding can refer to multiple properties in the datacontext.
        // Therefore, we determine the href when any property in the datacontext changes.
        public OnDataContextChange(property: string, value: any) {
            this.ConstructHref();
        }


        private ConstructHref() {
            var route = this.GetValueByKey("route");
            var properties = this.GetValueByKey("properties").split(";");

            if (properties) {
                route = route + "?";

                properties.forEach((property) => {
                    var keyValue = property.split("=");
                    route = route + keyValue[0];
                    route = route + "=";
                    route = route + this.GetProperty(keyValue[1]);
                    route = route + "&";
                });
            }

            route = route.substring(0, route.length - 1).replace(" ", "");

            this.Element.attr("href", route);
        }

        
        // This method is part of DataContext class too... ViewModels are DataContext objects, but JSON objects as returned
        // from the server are not by default. We should convert JSON objects into DataContext objects whenever possible somehow?
        private GetProperty(propertyName: string): any {
            var instance = this.DataContext;
            var counter = 0;
            var elements = propertyName.split(".");
            for (var i = 0; i < elements.length - 1; i++) {
                instance = instance[elements[i].trim()];
                counter++;

                if (!instance)
                    break;
            }

            if (!instance)
                return null;
            else
                return instance[elements[counter]];
        }
    }
}