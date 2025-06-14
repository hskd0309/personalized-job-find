// Template imports
import ModernCVCasual from './ModernCVCasual';
import AwesomeCV from './AwesomeCV';
import DeedyResume from './DeedyResume';
import FriggeriCV from './FriggeriCV';
import WilsonResume from './WilsonResume';
import TwentySecondsCV from './TwentySecondsCV';
import AltaCV from './AltaCV';
import ModernCVBanking from './ModernCVBanking';

// Template exports
export { ModernCVCasual, AwesomeCV, DeedyResume, FriggeriCV, WilsonResume, TwentySecondsCV, AltaCV, ModernCVBanking };

// Template mapping for the resume builder
export const resumeTemplateMap = {
  'moderncv-casual': ModernCVCasual,
  'moderncv-classic': ModernCVCasual,
  'moderncv-banking': ModernCVBanking,
  'moderncv-oldstyle': ModernCVBanking,
  'awesome-cv': AwesomeCV,
  'deedy-resume': DeedyResume,
  'friggeri-cv': FriggeriCV,
  'plasmati-graduate-cv': DeedyResume,
  'twenty-seconds-cv': TwentySecondsCV,
  'wilson-resume': WilsonResume,
  'alta-cv': AltaCV,
  'limecv': AwesomeCV,
  'sb-admin-resume': ModernCVCasual,
  'developer-cv': DeedyResume,
  'europass-cv': ModernCVBanking,
  'compact-academic-cv': AltaCV,
  'hipster-cv': FriggeriCV,
  'banker-cv': ModernCVBanking,
  'casual-cv': ModernCVCasual,
  'infographic-resume': TwentySecondsCV,
};