import { useUser } from "../user";
import { usePost } from "./index";
import { useDetailType } from "../page";
import { useEffect, useState } from "react";

export function useIsPostAuthor() {
  const user = useUser();
  const post = usePost();
  const type = useDetailType();
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAuthor(false);
    } else if (type === "post") {
      setIsAuthor(post.author?.username === user.username);
    } else {
      setIsAuthor(post?.authors?.includes(user.address));
    }
  }, [user, type, post]);

  return isAuthor;
}
