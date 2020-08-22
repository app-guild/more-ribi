export default class Product {
    private id: string | number;
    private name: string;
    private price: number;
    private available: boolean = false;
    private imageUrl: string = "";

    constructor(json: any) {
        this.id = json.id;
        this.name = json.name;
        this.price = json?.salePrices[0]?.value;
        this.available = !!json.quantity;
        this.imageUrl = json?.image?.meta?.href;
    }

    getId(): string | number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    isAvailable(): boolean {
        return this.available;
    }

    getImage(): string {
        return this.imageUrl;
    }

    getPrice(): number {
        return this.price;
    }
}
