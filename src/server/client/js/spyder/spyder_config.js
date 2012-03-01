Spyder_server = "http://172.16.130.103/spyder/";

Spyder.constants.userServer = new SpyderUserSvc(Spyder_server);
if (SpyderSeedSvc)
	Spyder.constants.seedServer = new SpyderSeedSvc(Spyder_server);

if (SpyderArticleSvc)
	Spyder.constants.articleServer = new SpyderArticleSvc(Spyder_server)
