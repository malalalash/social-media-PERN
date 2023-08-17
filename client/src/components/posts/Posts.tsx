import Post from "./Post";
import { useInfiniteQuery } from "react-query";
import { getInfinitePosts } from "../../api/posts/getInfinitePosts";
import { PostType } from "../../types";
import Skeleton from "../Skeleton";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
const Posts = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "0px",
  });
  const limit = 10;
  const { data, fetchNextPage, isSuccess, hasNextPage, isLoading } =
    useInfiniteQuery(
      ["posts"],
      ({ pageParam = 1 }) => getInfinitePosts(pageParam, limit),
      {
        getNextPageParam: (nextPage) => {
          if (nextPage.posts.length < limit) {
            return undefined;
          }
          return nextPage.nextPage;
        },
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  if (isLoading) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  }

  if (isSuccess)
    return (
      <section>
        {data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.posts.map((post: PostType) => {
              return (
                <article ref={ref} key={post.id}>
                  <Post post={post} />
                </article>
              );
            })}
          </Fragment>
        ))}
      </section>
    );
};

export default Posts;
