Spyder_server = "http://localhost/spyder/";

Spyder.constants.userServer = new SpyderUserSvc(Spyder_server);
if (SpyderSeedSvc)
    Spyder.constants.seedServer = new SpyderSeedSvc(Spyder_server);

if (SpyderArticleSvc)
    Spyder.constants.articleServer = new SpyderArticleSvc(Spyder_server)

if (SpyderWebsiteSvc)
    Spyder.constants.websiteServer = new SpyderWebsiteSvc(Spyder_server)
