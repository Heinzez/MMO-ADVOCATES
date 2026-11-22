<?php

/*
 * Firm details and public service catalogue.
 *
 * These values are rendered by the public Blade pages. They are kept here so a
 * single edit updates every page, and so the later website-content module can
 * replace this file with database-backed records without touching the views.
 * Only details supplied by the firm belong here: do not add partners,
 * qualifications, memberships, awards or testimonials that have not been
 * supplied and approved.
 */

return [
    /*
     * Whether the public pages look up published overrides from the website
     * content module. A deployment that serves only the static public pages,
     * with no database attached, sets PUBLIC_CONTENT_OVERRIDES=false so no
     * connection is attempted at all.
     */
    'content_overrides' => env('PUBLIC_CONTENT_OVERRIDES', true),

    'name' => 'MMO ADVOCATES LLP',
    'legal_name' => 'MMO Advocates LLP',
    'tagline' => 'COUNSEL. INTEGRITY. EXCELLENCE.',
    'monogram' => 'MMO',

    'phone_display' => '0725 144 472',
    'phone_link' => '+254725144472',
    'email' => 'mmoadvocatellp@gmail.com',

    'address_lines' => ['Kimathi House, Suite 807', 'Kimathi Street, Nairobi, Kenya'],
    'postal_address' => 'P.O. Box 2046-00200, Nairobi, Kenya',
    'city' => 'Nairobi, Kenya',
    'map_query' => 'Kimathi House, Kimathi Street, Nairobi, Kenya',

    'areas_of_work' => [
        'Litigation',
        'Conveyancing',
        'Legal drafting',
        'Mediation',
        'Legal research',
    ],

    /*
     * The eight practice areas specified in the PRD. 'summary' is the card text
     * used on the home page; 'detail' and 'examples' are used on the services page.
     */
    'services' => [
        [
            'slug' => 'conveyancing',
            'name' => 'Conveyancing',
            'icon' => 'home',
            'summary' => 'Guidance on land transactions, property transfers and related legal matters.',
            'detail' => 'We act for buyers, sellers and lenders in land and property transactions, preparing and reviewing the documents that move a transaction from agreement to registration.',
            'examples' => ['Sale and purchase agreements', 'Transfers and registration', 'Charges and discharges', 'Leases and tenancy documents'],
        ],
        [
            'slug' => 'criminal-law',
            'name' => 'Criminal Law',
            'icon' => 'scales',
            'summary' => 'Legal representation and support through criminal proceedings.',
            'detail' => 'We represent clients facing criminal allegations, from the first appearance through to the conclusion of the matter, and explain each stage of the process as it happens.',
            'examples' => ['Police station attendance', 'Bail and bond applications', 'Trial representation', 'Appeals and reviews'],
        ],
        [
            'slug' => 'environmental-and-land',
            'name' => 'Environmental & Land',
            'icon' => 'leaf',
            'summary' => 'Assistance with environmental, land-use and property-related disputes.',
            'detail' => 'We advise and act on disputes and compliance questions that turn on the use, occupation and ownership of land, including matters before the Environment and Land Court.',
            'examples' => ['Boundary and ownership disputes', 'Land-use and compliance questions', 'Trespass and encroachment claims', 'Environment and Land Court matters'],
        ],
        [
            'slug' => 'succession',
            'name' => 'Succession',
            'icon' => 'sparkle',
            'summary' => 'Support with estate administration, inheritance and succession matters.',
            'detail' => 'We guide families and personal representatives through the administration of an estate, whether or not a will was left, with attention to the sensitivities involved.',
            'examples' => ['Grants of probate', 'Letters of administration', 'Confirmation of grants', 'Distribution and inheritance disputes'],
        ],
        [
            'slug' => 'civil-litigation',
            'name' => 'Civil Litigation',
            'icon' => 'columns',
            'summary' => 'Representation in civil disputes, claims and court proceedings.',
            'detail' => 'We prepare, file and argue civil claims, and we advise on whether a dispute is better resolved by negotiation or mediation before it reaches a courtroom.',
            'examples' => ['Contract and commercial disputes', 'Debt recovery', 'Negligence claims', 'Enforcement of judgments'],
        ],
        [
            'slug' => 'small-claims',
            'name' => 'Small Claims',
            'icon' => 'receipt',
            'summary' => 'Practical assistance with qualifying small claims and dispute resolution.',
            'detail' => 'We help clients bring and defend qualifying claims in the Small Claims Court, where the procedure is quicker and the costs are proportionate to the amount in dispute.',
            'examples' => ['Qualifying monetary claims', 'Goods and services disputes', 'Defending a claim', 'Enforcement of awards'],
        ],
        [
            'slug' => 'divorce',
            'name' => 'Divorce',
            'icon' => 'rings',
            'summary' => 'Clear, considerate legal guidance through divorce proceedings.',
            'detail' => 'We act in the dissolution of marriage and the questions that follow it, keeping the process as measured as the circumstances allow.',
            'examples' => ['Petitions for dissolution', 'Separation agreements', 'Division of matrimonial property', 'Maintenance and spousal support'],
        ],
        [
            'slug' => 'child-custody',
            'name' => 'Child Custody',
            'icon' => 'shield',
            'summary' => 'Legal support focused on child welfare and custody arrangements.',
            'detail' => 'We act in custody, care and maintenance matters, with the welfare of the child as the governing consideration throughout.',
            'examples' => ['Custody and care applications', 'Access and visitation arrangements', 'Child maintenance', 'Variation of existing orders'],
        ],
    ],
];
