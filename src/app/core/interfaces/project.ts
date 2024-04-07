export interface Project {
    id_campaign?: number,
    title: string,
    description: string,
    start_date: Date,
    end_date: Date,
    status: string,
    user_id: number,
    products?: ProjectProducts[];
    brands?: Brand[]
}

export interface Brand {
    id_brand: number,
    brand: string
}

export interface ProjectProducts {
    id_campaign_product?: number,
    campaign_id?: number,
    brand_id?: number,
    sunglass_units: number,
    eyewear_units: number,
    brands?: Brand[]
}