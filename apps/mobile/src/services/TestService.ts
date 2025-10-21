
export class GoogleFitService {
    private static instance: GoogleFitService;
    private isAuthorized = false;
    private mockSteps = 0;

    static getInstance(): GoogleFitService {
        if (!GoogleFitService.instance) {
            GoogleFitService.instance = new GoogleFitService();
        }
        return GoogleFitService.instance;
    }

    async authorize(): Promise<boolean> {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.isAuthorized = true;
            return true;
        } catch (error) {
            console.error('Auth error', error);
            return false;
        }
    }
}