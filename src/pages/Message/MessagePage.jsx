import React, { useEffect } from "react";
import Header from '../../components/layout/Header';
import FriendSearch from '../../pages/Message/Message';

export default function MessagePage() {
    useEffect(() => {
        // Khóa cuộn trang
        document.body.style.overflow = 'hidden';

        // Không gọi window.scrollTo(0, 0) nếu không cần thiết

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <FriendSearch />
            </div>
        </div>
    );
}
