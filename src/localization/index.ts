import { LocalizationTypes } from '../types';

class Localization {
    private static instance: Localization;

    static readonly suportedLanguages: Array<LocalizationTypes.TResource> = [
        { language: 'en', dialect: ['us', 'uk'], resource: 'http://127.0.0.1:8080/lang/en.json' },
        { language: 'pl', dialect: [], resource: 'http://127.0.0.1:8080/lang/pl.json' },
    ]

    public readonly resources: Array<LocalizationTypes.ILocalization> = [];

    private activeLocalization: LocalizationTypes.ILocalization;
    private activeDialect: Array<LocalizationTypes.TKeyPair> = [];

    // Defualt country and dialects (en-us)
    static readonly defCountry = (navigator?.language?.split('-')[0] ?? 'en').toLowerCase() as LocalizationTypes.TLetterCode;
    static readonly defDialect = (navigator?.language?.split('-')[1] ?? 'us').toLowerCase() as LocalizationTypes.TLetterCode;


    private hooks: Array<{
        key: string,
        args: Array<string>,
        callback: LocalizationTypes.TLocalizationHook
    }> = [];


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
     * @name appendHook
     * 
     * @description Appends a hook to the list of hooks, called when the localization resource is loaded / changed.
     * 
     * @param key: string - The value to return when the hook is called
     * @param callback: Function - The callback to call when the key is changed
     * @param args: Array<string> - The arguments to replace in the string ${0}, ${1}, etc
     * 
     * @returns () => void - A function that removes the hook from the list of hooks
     */
    public appendHook(key: string, callback: LocalizationTypes.TLocalizationHook, args: Array<string> = []): () => void {
        const hook = { key, args, callback };

        // -- Add the hook to the list of hooks
        this.hooks.push(hook);

        // -- Execute the hook
        callback({
            key: hook.key,
            value: this.getLocal(hook.key, hook.args)
        });

        // -- Return a function that removes the hook from the list of hooks
        return () => {
            // -- Remove the hook from the list of hooks
            this.hooks = this.hooks.filter(h => h !== hook);
        }
    }

    private executeHooks(): void {
        // -- Execute all the hooks
        this.hooks.forEach(hook => hook.callback({
            key: hook.key,
            value: this.getLocal(hook.key, hook.args)
        }));
    }

    /**
     * @name loadLocalizationResource
     * 
     * @description Loads the localization resource from localstorage or the server, depending if its been loaded already,
     * language and dialect are determined by 'determineLanguage' function of the class.
     * 
     * @returns Promise<void> - A promise that resolves when the resource is loaded
     */
    public async loadLocalizationResource(forceLoad = false): Promise<void> {
        // -- Get the resource
        return this.loadResource(Localization.getResource(Localization.getLanguage()), forceLoad)
            .then(resource => {
                // -- Check if the resource is already loaded
                if (!this.resources.includes(resource))
                    // -- Add the resource to the list of resources
                    this.resources.push(resource);

                // -- Execute all the hooks 
                this.executeHooks();
            
            }).catch(error => console.error(error));
    }


    /**
     * @name getLocal
     * 
     * @description Gets the value of a key in the localization resource.
     * 
     * @param key: string - The key to get the value of
     * @param args: Array<string> - The arguments to replace in the string ${0}, ${1}, etc.
     */
    public getLocal(key: string, args: Array<string> = []): string {
        // -- Check if the resource is loaded
        if (!this.activeLocalization)
            throw new Error('Localization resource not loaded');

        
        // Attempt to get the key from the active dialect
        const dialect = this.activeDialect.find(pair => pair.key === key);
        if (dialect) return this.replaceArgs(dialect.value, args);


        // -- If the key is not found, use the default dialect
        const language = this.activeLocalization.keys.find(pair => pair.key === key);
        if (language) return this.replaceArgs(language.value, args);


        // -- If the key is not found, return the key
        return key;
    }
        

    private replaceArgs = (str: string, args: Array<string>): string =>
        args.reduce((acc, cur, i) => acc.replace(`\${${i}}`, cur), str);


    // -- Loads the resource from the json file
    private async loadResource(res: LocalizationTypes.TResource, forceLoad: boolean): Promise<LocalizationTypes.ILocalization> {
        // -- Attempt to load the localization file from webstorage
        let resource: string | undefined = localStorage.getItem(`lang-res-${res.language}`);

        // -- If the resource is not in localstorage, load it from the server
        if (!resource || forceLoad === true) await new Promise((resolve, reject) => {
            // -- load it from the server
            fetch(res.resource)
                .then(async(response) => { // -- Store the data
                    // -- store it in webstorage
                    localStorage.setItem(`lang-res-${res.language}`, await response.text());
                    resolve(response);
                }) .catch (error => reject(error)); 
        });

        // -- Parse the resource
        const parsedResource = JSON.parse(resource ?? '') as LocalizationTypes.ILocalization;

        // -- set the active localization
        this.activeLocalization = parsedResource;

        this.activeDialect = parsedResource.dialects.find(dialect =>
            dialect.dialect === Localization.dialect)?.keys as Array<LocalizationTypes.TKeyPair> ?? [];

        // -- Return the resource
        return parsedResource;
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
        if (!Localization.isSupported(language)) {
            console.warn(`Language ${language} is not supported, defaulting to english`);
            return this.getResource('en');
        }

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

        this.language = (language as LocalizationTypes.TSupported);
        
        // -- Return the
        return resource;
    }
}

export default Localization;