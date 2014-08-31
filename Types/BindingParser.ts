module Fenix.Types {

    export class BindingParser {

        private keyValues: any;

        constructor(binding: string) {
            this.keyValues = this.GetBindingKeyValues(binding);
        }

        public GetValueByKey(key: string) {
            for (var i = 0; i < this.keyValues.length; i++) {
                var pair = this.keyValues[i];
                if (pair.key == key.toUpperCase()) {
                    return pair.value;
                }
            }
            return undefined;
        }

        private GetBindingKeyValues(binding: string) {
            var keyvalues = [];

            if (binding) {
                var pairs = binding.split(",");
                for (var i = 0; i < pairs.length; i++) {
                    var parts = pairs[i].split(":");
                    if (parts.length == 1) {
                        keyvalues.push({ key: "PROPERTY", value: parts[0].trim() });
                    }
                    else {
                        keyvalues.push({ key: parts[0].trim().toUpperCase(), value: parts[1].trim() });
                    }
                }
            }

            return keyvalues;
        }
    }
}