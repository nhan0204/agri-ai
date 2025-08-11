export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fermy",
    url: "https://fermy.com",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NbQp5FxeGuiKOmwMpVkqvFO28tXwIY.png",
    description:
      "Company providing innovative health drinks that combine traditional fermentation technology from Amami Oshima with modern science",
    foundingLocation: {
      "@type": "Place",
      name: "Amami Oshima",
      addressCountry: "JP",
    },
    sameAs: ["https://instagram.com/fermy_official", "https://twitter.com/fermy_official"],
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Fermy Fermented Drink",
    description:
      "100% organic health drink combining traditional fermented beverage 'Miki' from Amami Oshima with goat milk",
    brand: {
      "@type": "Brand",
      name: "Fermy",
    },
    category: "Health Beverage",
    offers: {
      "@type": "Offer",
      price: "4.98",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2024-12-31",
      seller: {
        "@type": "Organization",
        name: "Fermy",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Misaki Sato",
        },
        reviewBody:
          "I started drinking it as a morning routine 3 months ago. My digestion improved and my skin condition got better. The natural sweetness makes it easy to drink, so it's easy to continue.",
      },
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Ingredients",
        value: "100% Organic",
      },
      {
        "@type": "PropertyValue",
        name: "Process",
        value: "Patented fermentation technology",
      },
      {
        "@type": "PropertyValue",
        name: "Additives",
        value: "No additives • Sugar-free",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does Fermy taste like?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It has a subtle sweetness and refreshing fermented taste that's easy to drink! You can enjoy its natural flavor.",
        },
      },
      {
        "@type": "Question",
        name: "Can people with milk allergies drink it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "People with cow's milk allergies may be able to drink it, but there are individual differences, so please consult your doctor.",
        },
      },
      {
        "@type": "Question",
        name: "How should I store it and what's the shelf life?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Store refrigerated for about 14 days. Please consume promptly after opening.",
        },
      },
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fermy.com",
      },
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fermy",
    url: "https://fermy.com",
    description: "Revolutionary fermented drink from Amami Oshima",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://fermy.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}
