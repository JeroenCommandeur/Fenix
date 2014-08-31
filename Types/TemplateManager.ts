module Fenix.Types {

    export class TemplateManager {

        private static templates = {};

        public static Retrieve(type: string, url: string, self: any, callback: (self: any, template: string) => void) {
            var template = this.templates[type];
            if (template) {
                if (callback)
                    callback(self, template);
            }
            else {
                $.get(url, (data) => {
                    this.templates[type] = data;
                    if (callback)
                        callback(self, data);
                });
            }
        }
    } 
}