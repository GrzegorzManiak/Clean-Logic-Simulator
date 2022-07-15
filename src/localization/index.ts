import { LocalizationTypes } from '../types';

class Localization {
    private static instance: Localization;

    static readonly suportedLanguages: Array<LocalizationTypes.TResource> = [
        { language: 'en', dialect: ['us', 'uk'], resource: '../graphics/localization/en.json' },
    ]


    // Defualt country and dialects (en-us)
    static readonly defCountry = (navigator?.language?.split('-')[0] ?? 'en').toLowerCase() as LocalizationTypes.TLetterCode;
    static readonly defDialect = (navigator?.language?.split('-')[1] ?? 'us').toLowerCase() as LocalizationTypes.TLetterCode;


    // -- language and dialect
    private static language: LocalizationTypes.TSupported = 'en';
    public static getLanguage = (): LocalizationTypes.TSupported => Localization.language;

    private static dialect: string = 'us';
    public static getDialect = (): string => Localization.dialect;


    private constructor() {}
    public static getInstance(): Localization {
        if (!Localization.instance) Localization.instance = new Localization();
        return Localization.instance;
    }


    /**
     * @name isSupported
     * 
     * @description Checks if the language is supported.
     * 
     * @param language The language to check if it is supported
     * @returns boolean Whether the language is supported
     */
    public static isSupported = (language: string): boolean =>
        Localization.suportedLanguages.some(l => l.language === language);
    

    /**
     * @name getResource
     * 
     * @description Gets the resource for the language.
     * 
     * @param language: TSupported - The supported language to get the resource for
     * @returns LocalizationTypes.TResource The resource for the language
     */
    public static getResource = (language: LocalizationTypes.TSupported): LocalizationTypes.TResource =>
        Localization.suportedLanguages.find(l => l.language === language);
    

    /**
     * @name determineLanguage
     * 
     * @description Determines the language of the browser, and sets the language accordingly,
     * if not supported, it will default to english, and set the dialect to the default dialect.
     * 
     * @param language: TLetterCode - The language to set the program to
     * @param dialect: TLetterCode - The dialect to set the program to
     * 
     * @returns LocalizationTypes.TSupported The language of the program
     */
    public static determineLanguage(language = Localization.defCountry, dialect = Localization.defDialect): LocalizationTypes.TResource {

        // -- Cast the language and dialect to lowercase (Makes it easier to work with)
        language = language.toLowerCase() as LocalizationTypes.TLetterCode;
        dialect = dialect.toLowerCase() as LocalizationTypes.TLetterCode;

        // -- If the language is not supported, default to english
        if (!Localization.isSupported(language))
            return this.getResource('en');

        // -- If the language is supported, we are confident to cast it as TSupported
        const resource =
            Localization.getResource((language as LocalizationTypes.TSupported));

        // -- Make sure a dialect is provided
        dialect = (
            dialect ?? // -- Provided dialect
            this.defDialect // -- Default dialect
        ).toLowerCase() as LocalizationTypes.TLetterCode;

        // -- If the language has a dialect, check if it is supported
        if (resource.dialect.includes(dialect)) 
            this.dialect = dialect;
        
        // -- Return the
        return resource;
    }
}

export default Localization;