import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const adminEmail = 'admin@agribook.com';
        const adminPassword = 'admin123';

        console.log(`Checking if user ${adminEmail} exists...`);

        // 1. Check if user exists
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', adminEmail)
            .maybeSingle();

        if (findError) {
            return NextResponse.json({ error: 'Error finding user', details: findError }, { status: 500 });
        }

        if (user) {
            console.log('User exists, updating password...');
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({
                    password_hash: adminPassword,
                    role: 'admin',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) {
                return NextResponse.json({ error: 'Error updating user', details: updateError }, { status: 500 });
            }

            return NextResponse.json({
                message: 'Admin user updated successfully',
                user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }
            });
        } else {
            console.log('User does not exist, creating...');
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    name: 'Super Admin',
                    email: adminEmail,
                    password_hash: adminPassword,
                    role: 'admin',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (createError) {
                return NextResponse.json({ error: 'Error creating user', details: createError }, { status: 500 });
            }

            return NextResponse.json({
                message: 'Admin user created successfully',
                user: { id: newUser.id, email: newUser.email, role: newUser.role }
            });
        }
    } catch (error: any) {
        console.error('Setup admin error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
