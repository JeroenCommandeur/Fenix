
module Fenix.Base {

    export class DataContextBase implements Fenix.Interfaces.IDataContext {

        private _store = {};


        public RegisterProperties(propertyNames: string[]) {

            for (var key in propertyNames) {
                var property = propertyNames[key];

                this.GenerateProperty(property);

                property = null;
            }
        }


        private GenerateProperty(property: string) {

            Object.defineProperty(this, property, {
                get: function () {
                    return this._store[property];
                },
                set: function (value) {
                    if (this._store[property] != value) {
                        this._store[property] = value;
                        $(this).trigger("change", [property, this._store[property]]);
                    }
                }
            });

        }


        public static Create(source) : Object {
            var result = new DataContextBase();

            result._store = {}

            Object.getOwnPropertyNames(source).forEach(function (property) {

                result._store[property] = source[property];

                Object.defineProperty(result, property, {
                    get: function () {
                        return this._store[property];
                    },
                    set: function (value) {
                        if (this._store[property] != value) {
                            this._store[property] = value;
                            $(this).trigger("change", [property, this._store[property]]);
                        }
                    }
                });
            });

            return <Object>result;
        }


        public static Extract(source): Object {
            var result = {};

            Object.getOwnPropertyNames(source).forEach(function (property) {
                if (property != "_store") {
                    result[property] = source[property];
                }
            });

            return result;
        }


        public static Extend(source) {

            source._store = {}

            Object.getOwnPropertyNames(source).forEach(function (property) {

                if (property != "_store") {
                    source._store[property] = source[property];

                    Object.defineProperty(source, property, {
                        get: function () {
                            return this._store[property];
                        },
                        set: function (value) {
                            if (this._store[property] != value) {
                                this._store[property] = value;
                                $(this).trigger("change", [property, this._store[property]]);
                            }
                        }
                    });
                }
            });

            return source;
        }


        public SetProperty(propertyName: string, value: any) {
            var instance = this;
            var counter = 0;
            var elements = propertyName.split(".");
            for (var i = 0; i < elements.length - 1; i++) {
                instance = instance[elements[i].trim()];
                counter++;
            }

            // Set value directly.
            if (instance)
                instance[elements[counter]] = value;
        }


        public GetProperty(propertyName: string): any {
            var instance = this;
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