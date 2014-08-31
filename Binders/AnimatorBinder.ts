module Fenix.Binders {

    export class AnimatorBinder extends Fenix.Base.BinderBase {

        static AttributeName(): string {
            return "animator";
        }


        public OnPropertyChange(value: any) {
            var type = <string>this.GetValueByKey("type");

            if (value) {
                var max = <string>this.GetValueByKey("MAX") + "px";
                this.Element.show();

                switch (type) {
                    case "height": {
                        this.Element.animate(
                            { "height": max },
                            "normal");
                    }
                }

                
            }
            else {
                var min = <string>this.GetValueByKey("MIN") + "px";

                switch (type) {
                    case "height": {
                        this.Element.animate(
                            { "height": min },
                            "normal", null, () => {
                                this.Element.hide();
                            });
                    }
                }
            }
        }
    }
}