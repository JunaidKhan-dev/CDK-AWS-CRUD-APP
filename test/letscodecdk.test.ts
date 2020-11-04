import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Letscodecdk from '../lib/letscodecdk-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Letscodecdk.LetscodecdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
