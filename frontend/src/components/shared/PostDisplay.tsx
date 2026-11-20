"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Post } from "@/lib/types";
import React, { useState } from "react";
import { CommentSection } from "../custom/comment/CommentSection";
import { formatRelative } from "@/lib/utils";
import { useGeneralStore } from "@/store/generalStore";
import { ReactionBar } from "./ReactionBar";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostActionMenu } from "../custom/post/PostActionMenu";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface PostDisplayProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onHide?: (postId: string) => void;
}

const SliderNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    type="button"
    aria-label="Next image"
    onClick={onClick}
    className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-all duration-150 absolute right-3 top-1/2 -translate-y-1/2 z-20 shadow-md cursor-pointer"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
);

const SliderPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    type="button"
    aria-label="Previous image"
    onClick={onClick}
    className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-all duration-150 absolute left-3 top-1/2 -translate-y-1/2 z-20 shadow-md cursor-pointer"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

export const PostDisplay: React.FC<PostDisplayProps> = ({
  post,
  onDelete,
  onHide,
}) => {
  const { setSelectedPost } = useGeneralStore();
  const [content, setContent] = useState(post.content);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    adaptiveHeight: false,
  };

  const imagesCount = post.images?.length || 0;

  return (
    <article className="w-full max-w-[620px] bg-card/75 border border-border/70 rounded-2xl p-4 md:p-5 shadow-xs hover:border-border transition-all duration-200 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <Link
          href={`/profile/${post.createdBy?.id}`}
          className="flex items-center gap-3 group min-w-0"
        >
          <Avatar className="w-10 h-10 border border-border/80 group-hover:border-primary/40 transition-colors shrink-0">
            <AvatarImage
              src={post.createdBy?.avatarUrl || "/noAvatar.png"}
              alt={post.createdBy?.firstname || "User"}
            />
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              {post.createdBy?.firstname?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {post.createdBy?.firstname} {post.createdBy?.lastname || ""}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              @{post.createdBy?.firstname?.toLowerCase()}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-xs text-muted-foreground/80 font-mono"
            title={post.updatedAt ? `Edited at ${post.updatedAt}` : post.createdAt}
          >
            {post.updatedAt
              ? `edited ${formatRelative(post.updatedAt)}`
              : formatRelative(post.createdAt)}
          </span>
          <PostActionMenu
            post={{ ...post, content }}
            onDelete={onDelete}
            onHide={onHide}
            onEditSuccess={(newContent) => setContent(newContent)}
          />
        </div>
      </div>

      {/* Content */}
      <p className="mb-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
        {content}
      </p>

      {/* Media Rendering */}
      {imagesCount === 1 && (
        <div
          onClick={() => setSelectedPost(post)}
          className="mb-4 overflow-hidden rounded-xl border border-border/60 bg-secondary/30 relative max-h-[460px] cursor-pointer group"
        >
          <Image
            src={post.images[0].url}
            alt="post media"
            width={600}
            height={400}
            className="w-full h-auto max-h-[460px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}

      {imagesCount === 2 && (
        <div
          onClick={() => setSelectedPost(post)}
          className="mb-4 grid grid-cols-2 gap-2 overflow-hidden rounded-xl border border-border/60 cursor-pointer"
        >
          {post.images.map((img: any) => (
            <div key={img.id} className="relative h-64 bg-secondary/30 overflow-hidden group">
              <Image
                src={img.url}
                alt="post media"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      )}

      {imagesCount > 2 && (
        <div className="mb-4 overflow-hidden rounded-xl border border-border/60 relative bg-secondary/30">
          <Slider {...sliderSettings} className="w-full">
            {post.images.map((img: any) => (
              <div
                key={img.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer"
              >
                <div className="relative h-72 md:h-80 w-full overflow-hidden">
                  <Image
                    src={img.url}
                    alt="post media"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Action / Reaction Bar */}
      <div className="pt-2 border-t border-border/60">
        <ReactionBar
          post={post}
          onCommentClick={() => setSelectedPost(post)}
          showCommentButton
          className="mb-3"
        />
        <CommentSection postId={post.id} compact />
      </div>
    </article>
  );
};
