import { PhraseItem } from "../data/phraseitem";

export class API {
    private api_url: string;

    constructor(api_url: string) {
        this.api_url = api_url;
    }

    // Get a single entry
    public async get(phrase: string): Promise<PhraseItem | undefined> {
        const response = await this.query_api(phrase);
        if (response === undefined) {
            console.log("No phrase found");
            return undefined;
        }
        const data: any = await response.json();
        const phrase_item: PhraseItem = data["return"];
        return phrase_item;
    }

    private async query_api(phrase: string): Promise<Response | undefined> {
        let response = await fetch(this.api_url + `/phrase/${phrase}`, {
            method: 'GET'
        });
        console.log(response);
        if (response.ok) {
            return response;
        } else {
            response = await fetch(this.api_url + `/phrase/${phrase.toLowerCase()}`, {
                method: 'GET'
            });
            if (response.ok) {
                return response;
            } else {
                response = await fetch(this.api_url + `/phrase/${phrase.toUpperCase()}`, {
                    method: 'GET'
                });
                if (response.ok) {
                    return response;
                } else {
                    console.log("Failed to query api for ", phrase);
                    return undefined;
                }
            }
        }
    }
}
