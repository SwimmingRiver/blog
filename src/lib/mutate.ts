import { useMutation } from "@tanstack/react-query";
import supabase from "./supabase";
import type { CreatePost, UpdatePost, SinglePostResponse } from "@/types/post";

export const useCreatePost = () => {
  return useMutation<SinglePostResponse, Error, CreatePost>({
    mutationFn: async (post: CreatePost) => {
      const { tags, ...postData } = post;

      // Insert the post first
      const { data: newPost, error: postError } = await supabase
        .from("posts")
        .insert(postData)
        .select()
        .single();

      if (postError) {
        console.error("Post creation error:", postError);
        throw postError;
      }

      // Handle tags if provided
      if (tags && tags.length > 0) {
        // Get or create tags
        const tagIds: string[] = [];
        for (const tagName of tags) {
          const trimmedTag = tagName.trim();
          if (!trimmedTag) continue;

          // Try to get existing tag
          const { data: existingTags, error: selectError } = await supabase
            .from("tags")
            .select("id")
            .eq("name", trimmedTag)
            .limit(1);

          if (selectError) {
            console.error("Error finding tag:", selectError);
          }

          let existingTag = existingTags?.[0];

          if (!existingTag) {
            // Create new tag
            const { data: newTag, error: tagError } = await supabase
              .from("tags")
              .insert({ name: trimmedTag })
              .select("id")
              .single();

            if (tagError) {
              console.error("Tag creation error:", tagError);
              throw tagError;
            }

            existingTag = newTag;
          }

          if (existingTag) {
            tagIds.push(existingTag.id);
          }
        }

        // Create post_tags relationships
        if (tagIds.length > 0) {
          const postTagsData = tagIds.map((tagId) => ({
            post_id: newPost.id,
            tag_id: tagId,
          }));

          const { error: postTagsError } = await supabase
            .from("post_tags")
            .insert(postTagsData);

          if (postTagsError) {
            console.error("Post tags creation error:", postTagsError);
            throw postTagsError;
          }
        }
      }

      return { data: newPost, error: undefined };
    },
  });
};

export const useUpdatePost = (id: string) => {
  return useMutation<SinglePostResponse, Error, UpdatePost>({
    mutationFn: async (post: UpdatePost) => {
      const { tags, ...postData } = post;

      // Update the post
      const { data: updatedPost, error: postError } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", id)
        .select()
        .single();

      if (postError) {
        throw postError;
      }

      // Handle tags if provided
      if (tags !== undefined) {
        // Delete existing post_tags relationships
        const { error: deleteError } = await supabase
          .from("post_tags")
          .delete()
          .eq("post_id", id);

        if (deleteError) throw deleteError;

        // Add new tags if any
        if (tags.length > 0) {
          const tagIds: string[] = [];
          for (const tagName of tags) {
            const trimmedTag = tagName.trim();
            if (!trimmedTag) continue;

            // Try to get existing tag
            const { data: existingTags } = await supabase
              .from("tags")
              .select("id")
              .eq("name", trimmedTag)
              .limit(1);

            let existingTag = existingTags?.[0];

            if (!existingTag) {
              // Create new tag
              const { data: newTag, error: tagError } = await supabase
                .from("tags")
                .insert({ name: trimmedTag })
                .select("id")
                .single();

              if (tagError) throw tagError;
              existingTag = newTag;
            }

            if (existingTag) {
              tagIds.push(existingTag.id);
            }
          }

          // Create post_tags relationships
          if (tagIds.length > 0) {
            const postTagsData = tagIds.map((tagId) => ({
              post_id: id,
              tag_id: tagId,
            }));

            const { error: postTagsError } = await supabase
              .from("post_tags")
              .insert(postTagsData);

            if (postTagsError) throw postTagsError;
          }
        }
      }

      return { data: updatedPost, error: undefined };
    },
  });
};

export const useDeletePost = () => {
  return useMutation<SinglePostResponse, Error, string>({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }
      return { data, error: undefined };
    },
  });
};
