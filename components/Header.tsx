import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import styled from "styled-components";

const Nav = styled.nav`
    display: flex;
    padding: 2rem;
    align-items: center;
`;

const Links = styled.div`
    text-decoration: none;
    color: ${({ theme }) => theme.colors.foreground};
    display: inline-block;
`;

const BoldLink = styled(Links)`
    font-weight: bold;
    font-size: 20px;
`;

// Add this Dropdown component to wrap non-Feed items
const Dropdown = styled.div`
    position: relative;
    display: inline-block;
    margin-left: auto;

    div {
        display: none;
        position: absolute;
        right: 0;
        background-color: ${({ theme }) => theme.colors.background};
        border: 1px solid ${({ theme }) => theme.colors.foreground};
        border-radius: 3px;
        padding: 0.5rem 1rem;

        p {
            display: block;
            font-size: 13px;
            padding-right: 1rem;
        }

        button {
            display: block;
            margin-top: 0.5rem;
        }

        &:hover {
            display: block;
        }
    }

    &:hover div {
        display: block;
    }
`;

const Header: React.FC = () => {
    const router = useRouter();
    const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

    const { data: session, status } = useSession();

    let right = null;

    // the dropdown now wraps around all non-Feed items
    if (status === "loading") {
        right = (
            <Dropdown>
                <p>Validating session ...</p>
            </Dropdown>
        );
    }

    if (!session) {
        right = (
            <Dropdown>
                <Link href="/api/auth/signin" data-active={isActive("/signup")}>
                    Log in
                </Link>
            </Dropdown>
        );
    }

    if (session) {
        right = (
            <Dropdown>
                <p>
                    {session.user.name} ({session.user.email})
                </p>
                <Link href="/upload" data-active={isActive("/upload")}>
                    <button>
                        Upload Image
                    </button>
                </Link>
                <Link href="/config" data-active={isActive("/config")}>
                    <button>
                        Config
                    </button>
                </Link>
                <button onClick={() => signOut()}>
                    Log out
                </button>
            </Dropdown>
        );
    }

    return (
        <Nav>
            <BoldLink>
                <Link href="/" data-active={isActive("/")}>
                    Home
                </Link>
                <Link href="/personal" data-active={isActive("/personal")}>
                    Personal
                </Link>
                <Link href="/professional" data-active={isActive("/professional")}>
                    Professional
                </Link>
            </BoldLink>
            {right}
        </Nav>
    );
};

export default Header;