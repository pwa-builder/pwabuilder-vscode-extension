export interface ServiceWorker {
    id: number;
    serviceworkerPreview: string | null;
    webPreview: string | null;
    description: string | null;
    title: string | null;
    disable: boolean | false;
}