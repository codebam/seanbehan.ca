/**
 * Attribute rules for a body image, kept out of the .astro component so the
 * fallbacks are unit-testable.
 *
 * A stored image may carry any era's shape: the media library's `asset.url`,
 * the older import's `src`, no dimensions at all, or — after the content
 * repair — top-level `width`/`height` and a `variants` array of pre-built
 * derivatives (`{ url, width }`). The component renders what is present and
 * never invents a dimension; a body that predates the repair must look exactly
 * as it did.
 */

/** One derivative: the URL to serve and the width it was built for. */
export interface ImageVariant {
	url?: string;
	width?: number | string;
}

export interface PortableTextImageNode {
	asset?: { url?: string; variants?: ImageVariant[] | null } | null;
	src?: string;
	alt?: string | null;
	width?: number | string | null;
	height?: number | string | null;
	variants?: ImageVariant[] | null;
}

export interface ImageAttributes {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	srcset?: string;
	sizes?: string;
}

/** The reading column is 820px; below that the image can use the viewport. */
export const IMAGE_SIZES = '(min-width: 860px) 820px, 100vw';

const positiveInteger = (value: unknown): number | undefined => {
	const number = typeof value === 'number' ? value : Number(value);
	return Number.isInteger(number) && number > 0 ? number : undefined;
};

/**
 * The attributes for one image node, or null when there is no URL to render —
 * an image the CMS never finished storing should leave no empty `<img>` behind.
 */
export function imageAttributes(
	node: PortableTextImageNode | null | undefined
): ImageAttributes | null {
	const stored = typeof node?.asset?.url === 'string' ? node.asset.url : '';
	const src = stored || (typeof node?.src === 'string' ? node.src : '');
	if (!src) return null;

	const attributes: ImageAttributes = {
		src,
		alt: typeof node?.alt === 'string' ? node.alt : ''
	};

	const width = positiveInteger(node?.width);
	const height = positiveInteger(node?.height);
	if (width) attributes.width = width;
	if (height) attributes.height = height;

	// The repair writes `variants` beside width/height; accepting it under
	// `asset` too keeps the renderer working if the block layout lands there.
	const source = node?.variants ?? node?.asset?.variants;
	const variants = (Array.isArray(source) ? source : [])
		.map((variant) => ({
			url: typeof variant?.url === 'string' ? variant.url : '',
			width: positiveInteger(variant?.width)
		}))
		.filter(
			(variant): variant is { url: string; width: number } =>
				Boolean(variant.url) && variant.width !== undefined
		)
		.sort((a, b) => a.width - b.width);

	if (variants.length > 0) {
		attributes.srcset = variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ');
		attributes.sizes = IMAGE_SIZES;
	}

	return attributes;
}
