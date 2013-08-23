module ConnectionProxy {

    export class Store {
        public static Prefix: string = "___PROXY___";

        public StorageDevice: Storage;

        constructor() {
            this.StorageDevice = localStorage;
        }

        public Set(key: string, value: any): void {            
            this.StorageDevice.setItem(Store.Prefix + key, JSON.stringify(value));
        }

        public Get(key: string): any {
            return JSON.parse(this.StorageDevice.getItem(Store.Prefix + key));
        }

        public Clear(key: string): void {
            this.StorageDevice.removeItem(Store.Prefix + key);
        }

        public CleanKey(key: string): string {
            return key.replace(Store.Prefix,"");
        }
    }
}