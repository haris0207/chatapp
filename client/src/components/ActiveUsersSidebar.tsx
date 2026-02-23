import styles from './ActiveUsersSidebar.module.css';

interface ActiveUsersSidebarProps {
    users: string[];
    currentUsername: string;
}

export default function ActiveUsersSidebar({ users, currentUsername }: ActiveUsersSidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>Online ({users.length})</h2>
            </div>
            <ul className={styles.userList}>
                {users.map((user, idx) => (
                    <li key={`${user}-${idx}`} className={styles.userItem}>
                        <div className={styles.avatar}>
                            {user.charAt(0).toUpperCase()}
                            <span className={styles.onlineDot} />
                        </div>
                        <span className={`${styles.name} ${user === currentUsername ? styles.isCurrentUser : ''}`}>
                            {user} {user === currentUsername && '(You)'}
                        </span>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
