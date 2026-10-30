import { CodesandboxEmbedBlock, CodesandboxEmbedBlockFragment } from './CodesandboxEmbedBlock';
import { CopyPromptButton, CopyPromptButtonFragment } from './CopyPromptButton';
import { CtaButton, CtaButtonFragment } from './CtaButton';
import { Demo, DemoFragment } from './Demo';
import { Image, ImageFragment } from './Image';
import { ImageCarousel, ImageCarouselFragment } from './ImageCarousel';
import { InternalVideo, InternalVideoFragment } from './InternalVideo';
import { MultipleDemosBlock, MultipleDemosBlockFragment } from './MultipleDemosBlock';
import { QuestionAnswer, QuestionAnswerFragment } from './QuestionAnswer';
import { ShowcaseProjectBlock, ShowcaseProjectBlockFragment } from './ShowcaseProjectBlock';
import { Table, TableFragment } from './Table';
import { TabsBlock, TabsBlockFragment } from './TabsBlock';
import { TutorialVideo, TutorialVideoFragment } from './TutorialVideo';
import { Video, VideoFragment } from './Video';

/* The blocks of the content field of a blog post. */
export const defaultBlockFragments = [
  CodesandboxEmbedBlockFragment,
  CopyPromptButtonFragment,
  CtaButtonFragment,
  DemoFragment,
  ImageFragment,
  ImageCarouselFragment,
  InternalVideoFragment,
  MultipleDemosBlockFragment,
  QuestionAnswerFragment,
  ShowcaseProjectBlockFragment,
  TableFragment,
  TabsBlockFragment,
  TutorialVideoFragment,
  VideoFragment,
] as const;

export const defaultBlockComponents = {
  CodesandboxEmbedBlockRecord: CodesandboxEmbedBlock,
  CopyPromptButtonBlockRecord: CopyPromptButton,
  CtaButtonRecord: CtaButton,
  DemoRecord: Demo,
  ImageRecord: Image,
  ImageCarouselRecord: ImageCarousel,
  InternalVideoRecord: InternalVideo,
  MultipleDemosBlockRecord: MultipleDemosBlock,
  QuestionAnswerRecord: QuestionAnswer,
  ShowcaseProjectBlockRecord: ShowcaseProjectBlock,
  TableRecord: Table,
  TabsBlockRecord: TabsBlock,
  TutorialVideoRecord: TutorialVideo,
  VideoRecord: Video,
};
