export type User={
    user_id:string;
    first_name:string;
    last_name:string|null;
    username:string;
    image_url:string;
    address:string|null;
    locality:string;
    city:string;
    district:string;
    state:string;
    country:string;
    niches:string[];
}