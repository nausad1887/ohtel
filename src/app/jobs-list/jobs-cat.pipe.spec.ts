import { JobsCatPipe } from './jobs-cat.pipe';

describe('JobsCatPipe', () => {
  it('create an instance', () => {
    const pipe = new JobsCatPipe();
    expect(pipe).toBeTruthy();
  });
});
