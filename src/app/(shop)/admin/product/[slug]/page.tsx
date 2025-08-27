import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductFormPage({ params }: Props) {

    const { slug } = await params;

    const [ product, categories ] = await  Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])
    const { ok, data: categoriesData = [] } = categories;
        
    if( !product && slug !== 'new' )
        redirect('/admin/products');

    const title = (slug === 'new') ? 'Nuevo producto' : 'Editar producto';

    return (
        <>
            <Title title={title} />

            <ProductForm product={product ?? {}} categories={categoriesData}/>
        </>
    );
}