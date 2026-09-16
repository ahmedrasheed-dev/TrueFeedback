import {Message} from '@/models/User';
export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    isAcceptingMessages?: boolean;
    messages?: Message[];
    status?: number;
}