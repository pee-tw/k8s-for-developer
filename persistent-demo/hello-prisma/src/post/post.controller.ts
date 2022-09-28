import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  async getPosts(): Promise<PostModel[]> {
    return this.postService.getPosts({});
  }

  @Post('')
  async createPost(
    @Body() postData: { title: string; content?: string },
  ): Promise<PostModel> {
    const { title, content } = postData;
    return this.postService.createPost({
      title,
      content,
    });
  }
}
