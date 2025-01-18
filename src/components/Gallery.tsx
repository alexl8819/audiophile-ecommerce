import { type FC, useState, useEffect } from "react";

export interface ShowcaseStyling {
    roundedEdges: boolean
}

interface ProductShowcaseProps {
    name: string
    path: string
    target: string
    styles?: ShowcaseStyling
}

export const ProductShowcase: FC<ProductShowcaseProps> = ({ name, path, target, styles }) => {
    const [mobileThumbnail, setMobileThumbnail] = useState<string | null>(null);
    const [tabletThumbnail, setTabletThumbnail] = useState<string | null>(null);
    const [desktopThumbnail, setDesktopThumbnail] = useState<string | null>(null);

    const loadThumbnail = async (viewportModifier: string) => {
        let loadedThumbnail = null;

        try {
            loadedThumbnail = await import(`../assets/${path}/${viewportModifier}/${target}.jpg`);
        } catch (err) {
            console.error(err);
        }

        if (viewportModifier === 'mobile') {
            setMobileThumbnail(loadedThumbnail.default.src);
        } else if (viewportModifier === 'tablet') {
            setTabletThumbnail(loadedThumbnail.default.src);
        } else {
            setDesktopThumbnail(loadedThumbnail.default.src);
        }
    }

    useEffect(() => {
        loadThumbnail('mobile');
        loadThumbnail('tablet');
        loadThumbnail('desktop');
    }, []);

    return (
        <>
            {
                mobileThumbnail && tabletThumbnail && desktopThumbnail ? 
                (
                    <figure className='bg-light-gray flex flex-col justify-center items-center mb-6'>
                        <picture>
                            <source srcSet={mobileThumbnail} media="(max-width: 767px)" className={`${styles && styles.roundedEdges ? 'rounded-lg' : ''}`} />
                            <source srcSet={tabletThumbnail} media="(max-width: 1023px)" className={`${styles && styles.roundedEdges ? 'rounded-lg' : ''}`} />
                            <source srcSet={desktopThumbnail} media="(min-width: 1024px)" className={`${styles && styles.roundedEdges ? 'rounded-lg' : ''}`} />
                            <img className={`w-auto h-auto ${styles && styles.roundedEdges ? 'rounded-lg' : ''}`} src={mobileThumbnail} alt={`${name} product preview`} loading='lazy' />
                        </picture>
			        </figure>
                ) : null
            }
        </>
    );
}

export default ProductShowcase;