import Link from "next/link";


const HomeMenu = ({ pathname }) => {

  return (<div className="leftSectionHome">
      <Link href='/dashboard/publish-a-post' className={ pathname === '/dashboard/publish-a-post' ? 'activeLinks' : ''} >
        Publish Post
      </Link>
      <Link href='/dashboard/analytics' className={ pathname === '/dashboard/analytics' ? 'activeLinks' : ''} >
        Analytics
      </Link>
      <Link href='/dashboard/posts-status' className={ pathname === '/dashboard/posts-status' ? 'activeLinks' : ''} >
        Post Status
      </Link>
      <Link href='/dashboard/archived-posts' className={ pathname === '/dashboard/archived-posts' ? 'activeLinks' : ''} >
        Archive
      </Link>
  </div>)
};

export default HomeMenu;
