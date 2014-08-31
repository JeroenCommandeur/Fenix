module Fenix.Types {

    export class Utilities {


        public static CreateViewModel(viewmodelName: string, params?: any): IViewModel {

            var namespace: string = Fenix.Framework.ViewModels[viewmodelName];

            if (!namespace)
                return null;

            var instance = null;
            instance = window;
            var elements = namespace.split(".");
            for (var i = 0; i < elements.length; i++) {
                instance = instance[elements[i]];
                if (!instance)
                    return null;
            }

            if (instance[viewmodelName])
                return new instance[viewmodelName](params);
        }


        public static GetClassName(obj): string {

            if (obj && obj.constructor && obj.constructor.toString) {
                var arr = obj.constructor.toString().match(
                    /function\s*(\w+)/);

                if (arr && arr.length == 2) {
                    return arr[1];
                }
            }

            return undefined;
        }


        public static NewGuid(): string {
            var d = Date.now();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        }


        public static GetProperties(object: any) {
            var objectToInspect;
            var result = [];

            for (objectToInspect = object; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
                result = result.concat(Object.getOwnPropertyNames(objectToInspect));
            }

            return result;
        }


        public static NotifyChange(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && typeof obj[key] !== "function") {
                    console.debug(key);
                    var value = obj[key];
                    if (value && typeof value === "object")
                        this.NotifyChange(value);
                    else
                        $(obj).trigger("change", [key, obj[key]]);
                }
            }
        }


        public static StartsWith(source: string, prefix: string): boolean {
            return source.indexOf(prefix, 0) == 0;
        }


        public static EndsWith(source: string, suffix: string): boolean {
            return source.indexOf(suffix, source.length - suffix.length) !== -1;
        }

    }
}
 