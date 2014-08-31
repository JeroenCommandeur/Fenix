import MessageTypeEnum = Fenix.Enums.MessageTypeEnum;

module Fenix.Types {

    export class Message extends Fenix.Base.DataContextBase {

        constructor() {
            super();
            this.RegisterProperties(["HasMessage", "Caption", "Color"]);
            this.HasMessage = false;
        }


        public HasMessage: boolean;
        public Caption: string;
        public Color: string;


        public SetMessage(type: Fenix.Enums.MessageTypeEnum, message: string) {
            if (type == MessageTypeEnum.Error)
                this.Color = "#ff4b4b";

            if (type == MessageTypeEnum.Warning)
                this.Color = "#f88440";

            if (type == MessageTypeEnum.Information)
                this.Color = "#47a5ff";

            this.Caption = message;
            this.HasMessage = true;

        }


        public Clear() {
            this.Caption = null;
            this.HasMessage = false;
        }
    } 
}