interface SendInvitationEmailParams {
    inviterName: string;
    organizationName: string;
    invitationToken: string;
    inviteeEmail: string;
    role: string;
}
/**
 * Email service for sending various types of emails
 */
export declare class EmailService {
    private transporter;
    private readonly baseUrl;
    constructor();
    /**
     * Sends an invitation email to join an organization
     */
    sendInvitationEmail({ inviterName, organizationName, invitationToken, inviteeEmail, role, }: SendInvitationEmailParams): Promise<void>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=email.d.ts.map