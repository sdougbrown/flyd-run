# Flyd Run

[![Build Status](https://travis-ci.org/sdougbrown/flyd-run.svg)](https://travis-ci.org/sdougbrown/flyd-run)
[![GitHub issues](https://img.shields.io/github/issues/sdougbrown/flyd-run.svg)](https://github.com/sdougbrown/flyd-run/issues)
[![Dependencies](https://img.shields.io/david/sdougbrown/flyd-run.svg?style=flat)](https://david-dm.org/sdougbrown/flyd-run)

"Stateful" [flyd](https://github.com/paldepind/flyd) streams

#### What?

This is just a wrapper around flyd's stream API that adds a couple few new properties: `run`, `error`, and `catch`.  These are largely inspired by [mithril's new m.prop](https://github.com/lhorie/mithril.js/blob/rewrite/docs/prop.md).

#### Why?

Having a common API on every stream in an application allows you to do wrap other functionality and always provide the same API surface.  (Examples forthcoming).
