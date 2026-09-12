import React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

type VerificationEmailProps = {
    otp: string | number;
};

export default function VerificationEmail({ otp }: VerificationEmailProps) {
    const formattedOtp = String(otp).padStart(6, '0').slice(0, 6);

    return (
        <Html>
            <Head />
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                ink: '#17221d',
                                forest: '#183d32',
                                lime: '#c8f169',
                                mist: '#f4f7f5',
                            },
                        },
                    },
                }}
            >
                <Body className="m-0 bg-mist px-4 py-12 font-sans text-ink">
                    <Container className="mx-auto max-w-lg overflow-hidden rounded-[18px] border border-[#dce7e0] bg-white">
                        <Section className="bg-forest px-10 py-7">
                            <Text className="m-0 text-lg font-bold text-white">
                                <span className="mr-2 inline-block rounded-[10px] bg-lime px-3 py-2 text-forest">T</span>
                                <span className="align-middle">TrueFeedback</span>
                            </Text>
                        </Section>

                        <Section className="px-10 pb-10 pt-12 text-center">
                            <Text className="mb-3 mt-0 text-[11px] font-bold tracking-[2px] text-[#4c8069]">
                                SECURITY CHECK
                            </Text>
                            <Heading className="m-0 text-[32px] font-bold leading-tight tracking-[-0.5px] text-ink">
                                Verify your email
                            </Heading>
                            <Text className="mx-auto mb-0 mt-4 max-w-md text-base leading-6 text-[#617069]">
                                Use the verification code below to finish setting up your TrueFeedback account.
                            </Text>

                            <Section className="my-8 rounded-[14px] border border-[#dceba9] bg-[#f1f7df] px-4 py-5">
                                <Text className="mb-2 mt-0 text-[10px] font-bold tracking-[2px] text-[#6b795b]">
                                    YOUR ONE-TIME CODE
                                </Text>
                                <Text className="m-0 text-[34px] font-bold leading-none tracking-[9px] text-forest">
                                    {formattedOtp}
                                </Text>
                            </Section>

                            <Text className="mb-7 mt-0 text-[13px] leading-5 text-[#617069]">
                                This code expires in <strong className="text-forest">10 minutes</strong>.
                            </Text>
                            <Hr className="border-[#e8eeea]" />
                            <Text className="mb-0 mt-5 text-xs leading-5 text-[#87938d]">
                                If you did not request this code, you can safely ignore this email.
                            </Text>
                        </Section>

                        <Section className="border-t border-[#e8eeea] bg-[#f8faf8] px-10 py-6 text-center">
                            <Text className="mb-1 mt-0 text-xs leading-5 text-[#617069]">
                                TrueFeedback · Honest messages, thoughtfully shared.
                            </Text>
                            <Text className="m-0 text-[11px] leading-5 text-[#a0aaa4]">
                                Please do not reply to this automated email.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
